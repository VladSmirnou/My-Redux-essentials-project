import { Loader } from '@/common/components/Loader'
import { useAppDispatch } from '@/common/hooks/useAppDispatch'
import { useAppSelector } from '@/common/hooks/useAppSelector'
import {
  selectPostsStatus,
  updatePost,
} from '@/features/posts/model/postsSlice'

import { useForm } from 'react-hook-form'

const required = {
  value: true,
  message: 'this field is required',
}

type FormFields = {
  title: string
  content: string
}

type Props = FormFields & { postId: string; onFormClose: () => void }

export const UpdatePostForm = (props: Props) => {
  const { postId, title, content, onFormClose } = props
  const postStatus = useAppSelector(selectPostsStatus)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: { title, content },
  })

  const dispatch = useAppDispatch()

  const onSubmit = (data: FormFields) => {
    dispatch(updatePost({ postId, ...data })).then(() => onFormClose())
  }

  return (
    <div>
      {postStatus === 'pending' ? <Loader /> : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Post title:
          <input {...register('title', { required })} type="text" />
        </label>
        {errors.title && <p>{errors.title.message}</p>}
        <label>
          Post content:
          <textarea {...register('content', { required })} />
        </label>
        {errors.content && <p>{errors.content.message}</p>}
        <button>update</button>{' '}
        <button type="button" onClick={onFormClose}>
          close
        </button>
      </form>
    </div>
  )
}
