import { forwardRef } from "react"

function htmlTag(tag: string) {
  return forwardRef<any, any>((props, ref) => {
    const { style, ...rest } = props
    return <tag ref={ref} style={style} {...rest} />
  })
}

export const View = "div"
export const Text = "span"
export const H1 = "h1"
export const H2 = "h2"
export const H3 = "h3"
export const H4 = "h4"
export const P = "p"
export const Section = "section"
export const Header = "header"
export const Footer = "footer"
export const Main = "main"
export const Nav = "nav"
export const Button = "button"
export const Img = "img"
export const Input = "input"
export const Svg = "svg"
export const Label = "label"
export const Form = "form"
export const Aside = "aside"
