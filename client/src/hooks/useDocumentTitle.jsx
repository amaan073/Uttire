import { useEffect } from "react";

// whenever a title is passed to this hook, it will update the document title dynamically
const useDocumentTitle = (title) => {
  useEffect(() => {
    const baseTitle = "Uttire";
    const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
    // Update document title
    document.title = fullTitle;
  }, [title]);
};

export default useDocumentTitle;
