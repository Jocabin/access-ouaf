import Image from "next/image"

interface CardProps {
  imageUrl: string;
  title: string;
  price: string;
}

export default function Card({ imageUrl, title, price }: CardProps) {
  return (
    <div className="card">
      <div className="card-div"><Image src={imageUrl} alt={title} width={240} height={352} className="card-image"/></div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-price">{price}</p>
      </div>
    </div>
  )
}