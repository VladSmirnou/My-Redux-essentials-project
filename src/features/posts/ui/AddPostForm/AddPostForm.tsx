import { useAppDispatch } from '@/common/hooks/useAppDispatch'
import { useAppSelector } from '@/common/hooks/useAppSelector'
import { selectLoggedInUserId } from '@/features/auth/model/authSlice'
import { createPost } from '@/features/posts/model/postsSlice'
import { useForm } from 'react-hook-form'

const defaultValues = {
  title: '',
  content: '',
}

type FormFields = typeof defaultValues

const required = {
  value: true,
  message: 'this field is required',
}

export const AddPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>({
    defaultValues,
  })

  const userId = useAppSelector(selectLoggedInUserId)!

  const dispatch = useAppDispatch()

  const onSubmit = (data: FormFields) => {
    dispatch(createPost({ user: userId, ...data })).finally(() => reset())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Post title:
        {/* <input {...register('title', { required })} type="text" /> */}
        <input {...register('title')} type="text" />
      </label>
      {errors.title && <p>{errors.title.message}</p>}
      <label>
        Post content:
        <textarea {...register('content', { required })} />
      </label>
      {errors.content && <p>{errors.content.message}</p>}
      <button>add post</button>
    </form>
  )
}
