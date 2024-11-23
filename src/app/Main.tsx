import { MessagePopup } from '@/common/components/MessagePopup'
import { AddPostForm } from '@/features/posts/ui/AddPostForm/AddPostForm'
import { Posts } from '@/features/posts/ui/Posts/Posts'

export const Main = () => {
  return (
    <div>
      <MessagePopup />
      <AddPostForm />
      <Posts />
    </div>
  )
}
