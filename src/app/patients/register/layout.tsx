import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type RegisterLayoutProps = {
  children: React.ReactNode;
};

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <div className="flex flex-row p-4 justify-between   items-center">
            <div className="flex items-center h-full">
              <Image
                src="/assets/icons/logo-full.svg"
                height={1000}
                width={1000}
                alt="patient"
                className="h-10 w-fit"
              />
            </div>
            <div>
              <Button variant="outline" asChild size="default">
                <Link href="/patients/register/created">Created</Link>
              </Button>
            </div>
          </div>

          {children}

          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}
