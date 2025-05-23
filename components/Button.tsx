type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({ children, href, onClick }: ButtonProps) {
  if (href) {
    return (
      <a href={href} className="button">
        {children}
      </a>
    );
  } else {
    return (
      <button className="button" onClick={onClick}>
        {children}
      </button>
    );
  }
}
