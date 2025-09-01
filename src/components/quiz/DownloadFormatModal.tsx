import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, Download } from 'lucide-react';

interface DownloadFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFormat: (format: 'markdown' | 'richtext') => void;
}

export function DownloadFormatModal({
  isOpen,
  onClose,
  onSelectFormat,
}: DownloadFormatModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Choose Download Format
          </AlertDialogTitle>
          <AlertDialogDescription>
            Select the format you'd like to download your quiz results in. Both formats contain your complete career assessment analysis.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AlertDialogAction
              onClick={() => onSelectFormat('markdown')}
              className="h-auto p-4 flex-col items-start bg-primary hover:bg-primary/90"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                <span className="font-semibold">Markdown</span>
              </div>
              <span className="text-xs text-left opacity-90">
                Clean, structured format. Perfect for developers and note-taking apps.
              </span>
            </AlertDialogAction>
            
            <AlertDialogAction
              onClick={() => onSelectFormat('richtext')}
              className="h-auto p-4 flex-col items-start bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                <span className="font-semibold">Rich Text</span>
              </div>
              <span className="text-xs text-left opacity-90">
                Formatted text file. Compatible with Word, Pages, and most text editors.
              </span>
            </AlertDialogAction>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}