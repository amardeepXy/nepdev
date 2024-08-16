import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui";

function FileUploader({onChange, id, mediaUrl}, ref) {
  const [fileUrl, setFileUrl] = useState(mediaUrl || '');
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    onChange(acceptedFiles);
    }, []);
      const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
          "image/*": ['.jpeg', '.jpg', '.png', '.gif', '.svg'],
        },
        maxFiles: 1,
      });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" ref={ref} id={id} />
      {fileUrl ? (<>
        <div className="relative flex-center items-center">
          <img
            className="file_uploader-img object-cover"
            width={36}
            height={36}
            src={fileUrl}
            alt=""
          />
          <p className="file_uploader-label text-center" >Click or drag and drop to change</p>
        </div>
        </>
      ) : !isDragActive ? (
        <div className="file_uploader-box">
          <img src="./assets/icons/file-upload.svg" alt="" />
          <h3 className="font-bold text-xl text-gray-700 dark:text-light-2 mb-4">
            Drag & drop images here
          </h3>
          <p className="small-regular text-light-4 mb-3">SVG, JPG, PNG, GIF</p>
          <Button
            className="bg-light-2 text- hover:bg-light-2/50 dark:bg-dark-5 dark:shad-button_dark_4 w-full text-base"
            onClick={(e)=> {
              e.preventDefault();
              open();
            }}
          >
            Browse
          </Button>
        </div>
      ) : (
        <div className="file_uploader-box flex-center">
          <p className="text-light-3 font-bold text-2xl">Drop images here</p>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(FileUploader)