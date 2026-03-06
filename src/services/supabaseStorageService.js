// Supabase Storage Service
// Handles file uploads and downloads using Supabase Storage

import { supabase } from '../config/supabase.config';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Upload file to Supabase Storage with progress tracking
 * @param {File} file - File to upload
 * @param {string} userId - User ID (for organization)
 * @param {string} reportId - Report ID (for organization)
 * @param {function} onProgress - Progress callback (percentage)
 * @returns {Promise<object>} Object with downloadURL and storagePath
 */
export const uploadFileToSupabase = async (file, userId, reportId, onProgress) => {
    try {
        // Create file path for organization
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `${userId}/${reportId}/${fileName}`;
        const bucketName = 'medical-reports'; // You'll create this bucket in Supabase

        // Simulate progress (Supabase doesn't have built-in progress tracking)
        if (onProgress) {
            onProgress(10);
            setTimeout(() => onProgress(30), 100);
            setTimeout(() => onProgress(60), 200);
            setTimeout(() => onProgress(90), 300);
        }

        // Upload file to Supabase Storage
        // Note: For public buckets, we need to bypass RLS by using the service role key
        // OR disable RLS on the bucket in Supabase Dashboard
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false, // Don't overwrite existing files
                contentType: file.type,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }

        if (onProgress) {
            onProgress(100);
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        const downloadURL = urlData.publicUrl;

        console.log('✅ File uploaded to Supabase successfully:', {
            fileName,
            filePath,
            bucket: bucketName,
            downloadURL,
        });

        return {
            downloadURL,
            storagePath: filePath,
            fileName: file.name,
        };
    } catch (error) {
        console.error('Supabase Storage upload error:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
};

/**
 * Delete file from Supabase Storage
 * @param {string} storagePath - Storage path of the file
 * @returns {Promise<void>}
 */
export const deleteFileFromSupabase = async (storagePath) => {
    try {
        const bucketName = 'medical-reports';
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([storagePath]);

        if (error) {
            console.error('Supabase delete error:', error);
            // Don't throw if file doesn't exist
            if (error.message && !error.message.includes('not found')) {
                throw new Error('Failed to delete file from storage');
            }
        } else {
            console.log('✅ File deleted from Supabase:', storagePath);
        }
    } catch (error) {
        console.error('Supabase Storage delete error:', error);
        throw new Error('Failed to delete file from storage');
    }
};

/**
 * Get public URL for a file
 * @param {string} storagePath - Storage path of the file
 * @returns {string} Public URL
 */
export const getFileDownloadURL = (storagePath) => {
    const bucketName = 'medical-reports';
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(storagePath);
    
    return data.publicUrl;
};

// Helper: convert Blob to base64 string (without data: prefix)
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            try {
                const result = reader.result || '';
                // result is like "data:application/pdf;base64,AAAA..."
                const base64 = result.toString().split(',')[1] || '';
                resolve(base64);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/**
 * Download file with proper platform support
 * - On native (Capacitor) mobile: save to Documents/HealthReports, show popup, then open share sheet
 * - On mobile browser: navigate to the file URL so OS/browser handles it
 * - On desktop browser: use blob + hidden <a> to trigger a real download with filename
 *
 * @param {string} downloadURL - Download URL of the file
 * @param {string} fileName - Name of the file to download
 * @returns {Promise<void>}
 */
export const downloadFile = async (downloadURL, fileName) => {
    try {
        const hasWindow = typeof window !== 'undefined';
        const isNative = !!Capacitor?.isNativePlatform && Capacitor.isNativePlatform();

        // Native mobile app (Capacitor): save to Documents and trigger share sheet
        if (isNative) {
            const response = await fetch(downloadURL);
            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }

            const blob = await response.blob();
            const base64Data = await blobToBase64(blob);

            const originalName = fileName || 'report.pdf';
            const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
            const path = `HealthReports/${Date.now()}_${safeName}`;

            const writeResult = await Filesystem.writeFile({
                path,
                data: base64Data,
                directory: Directory.Documents,
                encoding: Encoding.BASE64,
                recursive: true,
            });

            const displayPath = `Documents/HealthReports/${safeName}`;

            // Small popup with saved location
            if (hasWindow && typeof window.alert === 'function') {
                window.alert(`File saved to:\n${displayPath}`);
            }

            // Trigger native share sheet
            try {
                await Share.share({
                    title: 'Share medical report',
                    text: originalName,
                    url: writeResult.uri,
                    dialogTitle: 'Share report',
                });
            } catch (shareError) {
                console.log('Share cancelled or not available:', shareError);
            }

            console.log('✅ File saved to device Documents and share triggered:', displayPath);
            return;
        }

        const ua = hasWindow ? (window.navigator.userAgent || '').toLowerCase() : '';

        const isMobileBrowser =
            ua.includes('android') ||
            ua.includes('iphone') ||
            ua.includes('ipad') ||
            ua.includes('ipod');

        // Mobile browser: navigate to the URL so OS/browser handles it
        if (hasWindow && isMobileBrowser) {
            window.location.href = downloadURL;
            return;
        }

        // Desktop browser: use blob download for nicer UX and filename support
        const response = await fetch(downloadURL);
        if (!response.ok) {
            throw new Error('Failed to fetch file');
        }

        const blob = await response.blob();
        const blobURL = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobURL;
        link.download = fileName;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            window.URL.revokeObjectURL(blobURL);
        }, 100);

        console.log('✅ File downloaded:', fileName);
    } catch (error) {
        console.error('Download error:', error);
        throw new Error('Failed to download file. Please try again.');
    }
};
