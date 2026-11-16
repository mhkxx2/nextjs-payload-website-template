'use client'
import type { RefCallback } from 'react'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

type UseClickableCardType<T extends HTMLElement> = {
  cardRef: RefCallback<T>
  linkRef: RefCallback<HTMLAnchorElement>
}

interface Props {
  external?: boolean
  newTab?: boolean
  scroll?: boolean
}

function useClickableCard<T extends HTMLElement>({
  external = false,
  newTab = false,
  scroll = true,
}: Props): UseClickableCardType<T> {
  const router = useRouter()
  const card = useRef<T>(null)
  const link = useRef<HTMLAnchorElement>(null)
  const timeDown = useRef<number>(0)
  const hasActiveParent = useRef<boolean>(false)
  const pressedButton = useRef<number>(0)

  const cardRef = useCallback((node: T | null) => {
    card.current = node
  }, [])

  const linkRef = useCallback((node: HTMLAnchorElement | null) => {
    link.current = node
  }, [])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.target) {
      const target = e.target as Element
      const timeNow = +new Date()
      const parent = target.closest('a')

      pressedButton.current = e.button

      if (!parent) {
        hasActiveParent.current = false
        timeDown.current = timeNow
      } else {
        hasActiveParent.current = true
      }
    }
  }, [])

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (link.current?.href) {
        const timeNow = +new Date()
        const difference = timeNow - timeDown.current

        if (difference <= 250 && !hasActiveParent.current && pressedButton.current === 0 && !e.ctrlKey) {
          if (external) {
            const target = newTab ? '_blank' : '_self'
            window.open(link.current.href, target)
          } else {
            router.push(link.current.href, { scroll })
          }
        }
      }
    },
    [external, newTab, router, scroll],
  )

  useEffect(() => {
    const cardNode = card.current
    const abortController = new AbortController()

    if (cardNode) {
      cardNode.addEventListener('mousedown', handleMouseDown, {
        signal: abortController.signal,
      })
      cardNode.addEventListener('mouseup', handleMouseUp, {
        signal: abortController.signal,
      })
    }

    return () => {
      abortController.abort()
    }
  }, [handleMouseDown, handleMouseUp])

  return { cardRef, linkRef }
}

export default useClickableCard
