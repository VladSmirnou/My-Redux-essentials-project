import {
  ReactionTypes,
  updatePostReactions,
  type Reactions as R,
} from '@/features/posts/model/postsSlice'
import { useAppDispatch } from '../hooks/useAppDispatch'

type Props = {
  reactions: R
}

export const Reactions = (props: Props) => {
  const { reactions } = props
  const { id: reactionId, ...rest } = reactions

  const dispatch = useAppDispatch()

  const JSXReactions = Object.entries(rest).map(([reaction, counter]) => {
    const r = reaction as ReactionTypes
    return (
      <button
        key={reaction}
        onClick={() =>
          dispatch(updatePostReactions({ reactionId, reaction: r }))
        }
      >
        {reaction} {counter}
      </button>
    )
  })

  return <div>{JSXReactions}</div>
}
