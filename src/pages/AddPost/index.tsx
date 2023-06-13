import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../redux/slices/auth'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'

export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [text, setText] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const inputFileRef = useRef(null)
  const isEditing = Boolean(id)

  const handleChangeFile = async (event: ChangeEvent) => {
    try {
      const target = event.target as HTMLInputElement
      if (!target.files?.length) return
      const file = target.files[0]

      const formData = new FormData()
      formData.append('image', file)
      const {data} = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (error) {
      console.warn(error)
      alert('Произошла ошибка при загрузки файла')
    }
  }

  const onClickRemoveImage = () => {
    setImageUrl('')
  }

  const onChange = React.useCallback((text: string) => {
    setText(text)
  }, [])

  const onSubmit = async () => {
    try {
      setLoading(true)
      const fields = {
        title,
        imageUrl,
        tags,
        text
      }
      const {data} = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields)
      const _id = isEditing ? id : data._id
      navigate(`/posts/${_id}`)
    } catch (error) {
      console.warn(error)
      alert('Произошла ошибка при создании статьи')
    }
  }

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({data}) => {
        //@ts-ignore
        setTitle(data.title)
        //@ts-ignore
        setText(data.text)
        //@ts-ignore
        setImageUrl(data.imageUrl)
        //@ts-ignore
        setTags(data.tags.join(','))
      }).catch(error => {
        console.warn(error)
        alert('Произошла ошибка при получении статьи')
      })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  )

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <Paper style={{ padding: 30 }}>
      {/*@ts-ignore*/}
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:8080${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      {/* @ts-ignore */}
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  )
}
