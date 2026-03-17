"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { FileImage } from "lucide-react";

type Props = {
  defaultImage?: string;
  handleFile: (_file: File) => void;
};

const CloudinaryUpload = ({ handleFile, defaultImage }: Props) => {
  const [image, setImage] = useState(defaultImage || "");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    if (file) {
      handleFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <label htmlFor="file-input">
      {image ? (
        <div>
          <Image
            alt="uploaded"
            src={image}
            width={1000}
            height={1000}
            className="w-full h-34.5 object-cover object-center rounded-md"
          />
        </div>
      ) : (
        <div>
          <div className="h-34.5 border rounded-md flex flex-col justify-center items-center">
            <FileImage className="stroke-[#71717a] w-4.5 h-4.5" />
            <p className="text-[#71717a] text-[14px]">Add image</p>
          </div>
        </div>
      )}
      <Input
        id="file-input"
        onChange={handleOnChange}
        type="file"
        className="w-100 hidden"
      />
    </label>
  );
};
export default CloudinaryUpload;
