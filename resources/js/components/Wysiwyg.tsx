/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { lazy } from "react";

const Editor = lazy(async () => {
  const mod = await import("react-simple-wysiwyg");
  return {
    default: ({ value, onChange, focused }: any) => {
      // Handler to limit input length
      const handleChange = (e: any) => {
        const newValue = e.target.value;
        if (newValue.length <= 2500) {
          onChange(newValue);
        }
      };

      return (
        <mod.EditorProvider>
          {focused && (
            <div className="flex gap-4 p-2 mb-2 rounded-md text-primary">
              <mod.BtnBold />
              <mod.BtnItalic />
              <mod.BtnUnderline />
            </div>
          )}

          <mod.Editor
            value={value}
            onChange={handleChange}
            className="w-full min-h-[200px] p-3 border border-input rounded-md text-black dark:text-white"
            placeholder="Your amazing text"
          />
          <div className="text-sm mt-2">
            {value.length}/2500 characters
          </div>
        </mod.EditorProvider>
      );
    },
  };
});

export default Editor;
