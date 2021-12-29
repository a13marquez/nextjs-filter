type File = {
  url: string
}
type ThumbnailImage = {
  file: File
}

type Color = {
  name: string
}

type Node = {
  price: string
}

type Edge = {
  node: Node
}

export type ShopifyProduct = {
  node: {
    name: string
    node_locale: string
    thumbnailImage: ThumbnailImage
    colorFamily: Color[] | null
    categoryTags: string[]
    shopifyProductEu: {
      variants: {
        edges: Edge[]
      }
    }
  }
}
