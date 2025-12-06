// src/utils/paths.ts
import * as path from "path";

/**
 * Legacy images directory for storing all uploaded images and files
 * Subdirectories will be created as needed (tools/, thumbs/, etc.)
 */
export const IMAGES_DIR = "/opt/Gallery/images";

/**
 * Get the path to a subdirectory within the images directory
 * @param subdir - Subdirectory name (e.g., "tools", "thumbs")
 * @returns Absolute path to the subdirectory
 */
export const getImagesSubdir = (subdir: string): string => {
  return path.join(IMAGES_DIR, subdir);
};

