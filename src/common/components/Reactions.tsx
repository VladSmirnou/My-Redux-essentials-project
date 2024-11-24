import {
  ReactionTypes,
  updatePostReactions,
  type Reactions as R,
} from '@/features/posts/model/postsSlice'
import { useAppDispatch } from '../hooks/useAppDispatch'

type Props = {
  reactions: R
  postId: string
}

export const Reactions = (props: Props) => {
  const { reactions, postId } = props
  const { id: reactionId, ...rest } = reactions

  const dispatch = useAppDispatch()

  const JSXReactions = Object.entries(rest).map(([reaction, counter]) => {
    const r = reaction as ReactionTypes
    return (
      <button
        key={reaction}
        onClick={() => dispatch(updatePostReactions({ postId, reaction: r }))}
      >
        {reaction} {counter}
      </button>
    )
  })

  return <div>{JSXReactions}</div>
}
