"use client";
import { Inbox, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useDropzone } from "react-dropzone";
import { uploadToS3 } from "@/lib/db/s3";
import axios from "axios";
import toast from "react-hot-toast";

const FileUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      console.log("response over there");
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10MB
        toast.error("File size should be less than 10MB");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          return;
        }
        mutate(data, {
          onSuccess: (data) => {
            console.log(data);
            // toast.success(data.message);
          },
          onError: (error) => {
            toast.error("error creating chat");
          },
        });
      } catch (e) {
        console.log(e);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rouded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-x1 cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            <Loader2 className="w-10 h-10 text-blue-500 anime-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-12 h-12 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop the PDF there</p>
          </>
        )}
      </div>
    </div>
  );
};
export default FileUpload;
