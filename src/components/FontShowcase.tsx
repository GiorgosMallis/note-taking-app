import React from 'react';

const FontShowcase: React.FC = () => {
  const sampleText = "MalliScribe - Your Personal Note Taking App";
  const fonts = [
    {
      name: "Inter",
      class: "font-inter",
      description: "Clean and modern, perfect for professional interfaces",
    },
    {
      name: "Poppins",
      class: "font-poppins",
      description: "Geometric with a friendly touch, great for headings",
    },
    {
      name: "Nunito",
      class: "font-nunito",
      description: "Well-balanced with rounded terminals, very readable",
    },
    {
      name: "Plus Jakarta Sans",
      class: "font-jakarta",
      description: "Contemporary and versatile, excellent for both text and headings",
    },
    {
      name: "Outfit",
      class: "font-outfit",
      description: "Modern and minimal, perfect for clean interfaces",
    },
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Font Options for MalliScribe</h2>
      <div className="space-y-8">
        {fonts.map((font) => (
          <div key={font.name} className="border-b pb-6">
            <div className={`${font.class} space-y-4`}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg text-gray-600">{font.name}</h3>
                <p className="text-sm text-gray-500">{font.description}</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold">{sampleText}</p>
                <p className="text-2xl font-semibold">The quick brown fox jumps over the lazy dog</p>
                <p className="text-base">
                  Create, organize, and access your notes with ease. MalliScribe provides a seamless
                  note-taking experience with support for categories and tags.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontShowcase;
