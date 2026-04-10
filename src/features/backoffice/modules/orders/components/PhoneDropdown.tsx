import { Phone } from "lucide-react";

import { ViberIcon } from "@/shared/components/icons/viber.tsx";
import { WhatsAppIcon } from "@/shared/components/icons/whatsapp.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu.tsx";

interface PhoneDropdownProps {
  phoneNumber: string;
}

export const PhoneDropdown = ({ phoneNumber }: PhoneDropdownProps) => {
  const digits = phoneNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${digits}`;
  const viberUrl = `viber://chat?number=%2B${digits}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="text-blue-500 text-sm cursor-pointer hover:underline">
          {phoneNumber}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a href={`tel:${phoneNumber}`}>
            <Phone />
            <span>Телефон</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            <span>WhatsApp</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={viberUrl}>
            <ViberIcon />
            <span>Viber</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
