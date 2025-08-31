import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuyMeCoffeeButtonProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showEmoji?: boolean;
  showIcon?: boolean;
}

export function BuyMeCoffeeButton({
  size = 'default',
  className,
  showEmoji = false,
  showIcon = true
}: BuyMeCoffeeButtonProps) {
  const handleClick = () => {
    window.open('https://buymeacoffee.com/michaelzick', '_blank');
  };

  return (
    <Button
      size={size}
      variant="outline"
      onClick={handleClick}
      className={cn(
        "bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black hover:text-black border-[#FFDD00] hover:border-[#FFDD00]/90 font-medium flex items-center transition-all duration-200 hover:scale-105",
        showIcon && "gap-2",
        className
      )}
    >
      {showIcon && <Coffee className="w-4 h-4" />}
      Buy Me A Coffee{showEmoji ? ' ☕' : ''}
    </Button>
  );
}
