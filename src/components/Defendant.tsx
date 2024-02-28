import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Defendant(props: any) {
  return (
    <div className="space-y-8 mt-12">
      {props?.parties?.map((partie: any, index: number) => (
        <div
          className={`flex items-center w-1/2 ${
            index % 2 === 0 ? "pr-2" : "pl-2"
          }`}
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{partie.name}</p>
            <p className="text-sm text-muted-foreground">
              {partie.person_type}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
