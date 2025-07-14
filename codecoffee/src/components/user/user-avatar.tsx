import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const UserAvatar = ({ profilePic }: { profilePic: string }) => {
  return (
    <Avatar>
      <AvatarImage src={profilePic} />
      <AvatarFallback>
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};
