"use client";

import React, { useState, useCallback } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FileIcon } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { PDFViewer } from "./PDFViewer";

interface Document {
  id: string;
  filename: string;
  url: string;
}

export function SearchDocument() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsOpen(false);
  };

  const handleInputChange = useCallback(async (value: string) => {
    setIsOpen(true);
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/documents/search?query=${value}&from=0&size=100`
      );
      const data = await response.json();

      if (Array.isArray(data.documents)) {
        setSearchResults(data.documents);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResults([]);
    }
  }, []);

  return (
    <div className="container mx-auto">
      <Command className="rounded-lg border shadow-md" shouldFilter={false}>
        <CommandInput
          placeholder="Search for an attachment"
          onValueChange={handleInputChange}
          value={searchTerm}
        />
        {isOpen && (
          <CommandList>
            {searchTerm.length > 0 ? (
              searchResults.length === 0 ? (
                <CommandGroup heading="Search Results">
                  <CommandEmpty>No results found.</CommandEmpty>
                </CommandGroup>
              ) : (
                <CommandGroup heading="Search Results">
                  {searchResults.map((document) => (
                    <CommandItem key={document.id}>
                      <FileIcon className="mr-2 h-4 w-4" />
                      <div onClick={() => handleSelectDocument(document)}>
                        {document.filename}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            ) : null}
          </CommandList>
        )}
      </Command>
      {selectedDocument && <PDFViewer url={selectedDocument.url} />}
    </div>
  );
}
