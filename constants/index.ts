export const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export const shapeElements = [
  {
    icon: "/assets/rectangle.svg",
    name: "Retangulo",
    value: "rectangle",
  },
  {
    icon: "/assets/circle.svg",
    name: "Circulo",
    value: "circle",
  },
  {
    icon: "/assets/triangle.svg",
    name: "Triangulo",
    value: "triangle",
  },
  {
    icon: "/assets/line.svg",
    name: "Linha",
    value: "line",
  },
  {
    icon: "/assets/image.svg",
    name: "Imagem",
    value: "image",
  },
  {
    icon: "/assets/freeform.svg",
    name: "Desenho",
    value: "freeform",
  },
  {
    icon: "/assets/text.svg",
    value: "text",
    name: "Texto",
  },
];

export const navElements = [
  {
    icon: "/assets/select.svg",
    name: "Selecionar",
    value: "select",
  },
  {
    icon: "/assets/rectangle.svg",
    name: "Retangulo",
    value: shapeElements,
  },
  {
    icon: "/assets/text.svg",
    value: "text",
    name: "Texto",
  },
  {
    icon: "/assets/delete.svg",
    value: "delete",
    name: "Deletar",
  },
  {
    icon: "/assets/reset.svg",
    value: "reset",
    name: "Resetar",
  },
  {
    icon: "/assets/comments.svg",
    value: "comments",
    name: "Commentarios",
  },
];

export const defaultNavElement = {
  icon: "/assets/select.svg",
  name: "Selecionar",
  value: "select",
};

export const directionOptions = [
  { label: "Trazer para frente", value: "front", icon: "/assets/front.svg" },
  { label: "Enviar para trás", value: "back", icon: "/assets/back.svg" },
];

export const fontFamilyOptions = [
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Brush Script MT", label: "Brush Script MT" },
];

export const fontSizeOptions = [
  {
    value: "10",
    label: "10",
  },
  {
    value: "12",
    label: "12",
  },
  {
    value: "14",
    label: "14",
  },
  {
    value: "16",
    label: "16",
  },
  {
    value: "18",
    label: "18",
  },
  {
    value: "20",
    label: "20",
  },
  {
    value: "22",
    label: "22",
  },
  {
    value: "24",
    label: "24",
  },
  {
    value: "26",
    label: "26",
  },
  {
    value: "28",
    label: "28",
  },
  {
    value: "30",
    label: "30",
  },
  {
    value: "32",
    label: "32",
  },
  {
    value: "34",
    label: "34",
  },
  {
    value: "36",
    label: "36",
  },
];

export const fontWeightOptions = [
  {
    value: "400",
    label: "Normal",
  },
  {
    value: "500",
    label: "Semibold",
  },
  {
    value: "600",
    label: "Bold",
  },
];

export const alignmentOptions = [
  { value: "left", label: "Alinhar à esquerda", icon: "/assets/align-left.svg" },
  {
    value: "horizontalCenter",
    label: "Alinhar centro horizontal",
    icon: "/assets/align-horizontal-center.svg",
  },
  { value: "right", label: "Alinhar à direita", icon: "/assets/align-right.svg" },
  { value: "top", label: "Alinhar ao topo", icon: "/assets/align-top.svg" },
  {
    value: "verticalCenter",
    label: "Alinhar centro vertical",
    icon: "/assets/align-vertical-center.svg",
  },
  { value: "bottom", label: "Alinhar parte inferior", icon: "/assets/align-bottom.svg" },
];

export const shortcuts = [
  {
    key: "1",
    name: "Chat",
    shortcut: "/",
  },
  {
    key: "2",
    name: "Desfazer",
    shortcut: "⌘ + Z",
  },
  {
    key: "3",
    name: "Refazer",
    shortcut: "⌘ + Y",
  },
  {
    key: "4",
    name: "Reações",
    shortcut: "E",
  },
];
