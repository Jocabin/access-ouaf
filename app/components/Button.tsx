type ButtonProps = {
        children: any
}

export default function Button({ children }: ButtonProps) {
        return <button className="button">{children}</button>
}
