import React from "react"
import {
  View as RNView,
  Text as RNText,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Modal,
} from "react-native"

type StyleProp = any

function makeTextComponent(defaultStyle?: any) {
  return ({ style, children, ...props }: { style?: StyleProp; children?: React.ReactNode; [key: string]: any }) => (
    <RNText style={[defaultStyle, style]} {...props}>{children}</RNText>
  )
}

export const View = RNView
export const Text = RNText

export const H1 = makeTextComponent({ fontSize: 36, fontWeight: "700", letterSpacing: -0.5 })
export const H2 = makeTextComponent({ fontSize: 30, fontWeight: "600", letterSpacing: -0.3 })
export const H3 = makeTextComponent({ fontSize: 24, fontWeight: "600" })
export const H4 = makeTextComponent({ fontSize: 18, fontWeight: "600" })
export const P = makeTextComponent({ fontSize: 15, lineHeight: 22 })
export const Span = RNText
export const Label = RNText

export const Button = Pressable
export const Input = TextInput
export const Img = Image
export const Section = RNView
export const Header = RNView
export const Footer = RNView
export const Main = RNView
export const Nav = RNView
export const Form = RNView
export const Aside = RNView
export const Svg = RNView
