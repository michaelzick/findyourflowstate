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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Code, FileEdit } from 'lucide-react';

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

        <div className="py-4 space-y-6">
          {/* Format Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code className="h-4 w-4 text-primary" />
                  Markdown (.md)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li className="pl-0" style={{ textIndent: '-1em', paddingLeft: '1.2em' }}>Clean, structured format</li>
                  <li className="pl-0" style={{ textIndent: '-1em', paddingLeft: '1.2em' }}>Perfect for developers</li>
                  <li className="pl-0" style={{ textIndent: '-1em', paddingLeft: '1.2em' }}>Works with GitHub, Notion, etc.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileEdit className="h-4 w-4 text-primary" />
                  Rich Text (.rtf)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li className="pl-0" style={{ textIndent: '-1em', paddingLeft: '1.2em' }}>Compatible with Word, Pages, etc.</li>
                  <li className="pl-0" style={{ textIndent: '-1em', paddingLeft: '1.2em' }}>Preserves text formatting</li>
                  <li className="pl-0" style={{ textIndent: '-1em', paddingLeft: '1.2em' }}>Works across platforms</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <AlertDialogAction
              onClick={() => onSelectFormat('markdown')}
              className="flex-1"
            >
              <Code className="mr-2 h-4 w-4" />
              Download as Markdown
            </AlertDialogAction>

            <AlertDialogAction
              onClick={() => onSelectFormat('richtext')}
              className="flex-1"
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Download as Rich Text
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
