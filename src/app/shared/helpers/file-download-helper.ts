// import { saveAs } from 'file-saver';


// /**
//  * Saves a file by opening file-save-as dialog in the browser
//  * using file-save library.
//  * @param blobContent file content as a Blob
//  * @param fileName name file should be saved as
//  */

// export const saveFile = (blobContent: any, fileName: string) => {
//   const blob = new Blob([blobContent], { type: 'application/octet-stream' });
//   saveAs(blob, fileName);
// };

// /**
//  * Derives file name from the http response
//  * by looking inside content-disposition
//  * @param res http Response
//  */
// export const getFileNameFromResponseContentDisposition = (res: any) => {
//     // console.log(res);
//     const contentDisposition = res.headers.get('x-filename') || '';
//     // console.log(contentDisposition);
//     // const matches = /x-filename=([^;]+)/ig.exec(contentDisposition);
//     // console.log(matches);
//     const fileName = (contentDisposition || 'file-dowload').trim();
//   return fileName;
// };
