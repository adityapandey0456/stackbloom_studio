import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({
  footer = false,
}: {
  footer?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`studio-brand${footer ? " studio-brand-footer" : ""}`}
      aria-label="StackBloom Studio home"
    >
      <span className="studio-brand-frame">
        <Image
          src="/images/stackbloom-logo.png"
          alt="StackBloom Studio"
          width={2048}
          height={1143}
          className="studio-brand-image"
        />
      </span>
    </Link>
  );
}