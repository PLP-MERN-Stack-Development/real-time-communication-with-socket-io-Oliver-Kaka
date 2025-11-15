
import React, { useState, useRef } from 'react';
import { SendIcon, PaperClipIcon, XIcon } from './icons';

interface MessageInputProps {
  onSend: (text: string, image?: File) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim() || image) {
      onSend(text.trim(), image || undefined);
      setText('');
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 bg-gray-900/70 border-t border-gray-700 mt-auto">
        {imagePreview && (
            <div className="relative inline-block mb-2">
                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                <button onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 text-white hover:bg-red-500">
                   <XIcon />
                </button>
            </div>
        )}
      <div className="flex items-end bg-gray-800 rounded-lg p-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-white"
        >
          <PaperClipIcon />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none px-2 max-h-24"
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-full bg-indigo-600 text-white disabled:bg-gray-600 hover:bg-indigo-700 transition-colors"
          disabled={!text.trim() && !image}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
