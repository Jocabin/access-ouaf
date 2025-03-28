import Image from "next/image";
import Link from "next/link";

interface CardProps {
  imageUrl: string;
  title: string;
  price: string;
  width: number;
  height: number;
  href: string;
}

export default function Card({
  imageUrl,
  title,
  price,
  width,
  height,
  href,
}: CardProps) {
  return (
    <Link href={href} className="card">
      <div className="card-div">
        <Image
          src={imageUrl}
          alt={title}
          width={width}
          height={height}
          className="card-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-price">{price}</p>
      </div>
    </Link>
  );
}
