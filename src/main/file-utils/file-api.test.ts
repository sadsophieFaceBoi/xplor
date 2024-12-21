// import { describe, it } from "vitest";
// import { getSubDirectories, getFilesInDirectory } from './file-api';
// const assert = require('assert');

// describe('directoriesWithDateModified', () => {
//     it('should return directories with their last modified date', () => {
//         const result = getSubDirectories('./src');
//         assert(Array.isArray(result));
//     });

//     it('should handle empty directories', () => {
//         const result = getSubDirectories('./src/electron/file-utils/test-folder-empty');
//         assert.deepStrictEqual(result, []);
//     });

//     it('should throw an error for invalid paths', () => {
//         assert.throws(() => {
//             getSubDirectories('/invalid/path');
//         }, Error);
//     });
// });

// describe('getFilesInDirectory', () => {
//     it('should return files with their details', () => {
//         const result = getFilesInDirectory('./src');
//         assert(Array.isArray(result));
//         if (result.length > 0) {
//             assert(result[0].hasOwnProperty('name'));
//             assert(result[0].hasOwnProperty('type'));
//             assert(result[0].hasOwnProperty('dateModified'));
//             assert(result[0].hasOwnProperty('size'));
//         }
//     });

//     it('should handle empty directories', () => {
//         const result = getFilesInDirectory('./src/electron/file-utils/test-folder-empty');
//         assert.deepStrictEqual(result, []);
//     });

//     it('should throw an error for invalid paths', () => {
//         assert.throws(() => {
//             getFilesInDirectory('/invalid/path');
//         }, Error);
//     });
// });
