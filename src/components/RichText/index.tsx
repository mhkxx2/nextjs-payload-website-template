import { MediaBlockComponent as MediaBlock, MediaBlockProps } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlockComponent as CallToActionBlock, CallToActionBlockProps } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<Record<string, unknown>>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }: { node: { fields: Record<string, unknown> } }) => (
      <BannerBlock
        blockType="banner"
        className="col-start-2 mb-4"
        style={(node.fields?.style as 'info' | 'warning' | 'error' | 'success') || 'info'}
        content={node.fields?.content as DefaultTypedEditorState}
      />
    ),
    mediaBlock: ({ node }: { node: { fields: Record<string, unknown> } }) => (
      <MediaBlock
        media={node.fields.media as MediaBlockProps['media']}
        caption={node.fields.caption as string}
        position={node.fields.position as MediaBlockProps['position']}
      />
    ),
    code: ({ node }: { node: { fields: Record<string, unknown> } }) => (
      <CodeBlock className="col-start-2" {...(node.fields as unknown as CodeBlockProps)} />
    ),
    cta: ({ node }: { node: { fields: Record<string, unknown> } }) => (
      <CallToActionBlock
        {...(node.fields as unknown as CallToActionBlockProps)}
        heading={(node.fields?.heading as string) || ''}
        buttonText={(node.fields?.buttonText as string) || ''}
        buttonLink={(node.fields?.buttonLink as string) || ''}
      />
    ),
  },
})

type Props = {
  content?: unknown
  data?: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, content, data, ...rest } = props
  const editorData = (data || (typeof content === 'object' && content !== null ? content : undefined)) as never

  if (typeof content === 'string') {
    return <div className={cn('payload-richtext', className)}>{content}</div>
  }

  return (
    <ConvertRichText
      converters={jsxConverters}
      data={editorData}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
