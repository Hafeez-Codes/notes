import React, { useState, useEffect } from 'react'
import TagInput from '../../components/inputs/TagInput'
import { MdClose } from 'react-icons/md'
import Modal from 'react-modal' // Add this import
import axiosinstance from '../../utils/axiosinstance'

Modal.setAppElement('#root') // Add this line

const AddEditNotes = ({ noteData, type, getAllNotes, onClose }) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState([])

    useEffect(() => {
        if (type === 'edit' && noteData) {
            setTitle(noteData.title || '')
            setContent(noteData.content || '')
            setTags(noteData.tags || [])
        }
    }, [noteData, type])

    const [error, setError] = useState(null)

    // Add Note
    const addNewNote = async () => {
        try {
            const response = await axiosinstance.post('/notes/add-note', {
                title,
                content,
                tags
            })

            if (response.data && response.data.note) {
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message)
            }
        }
    }

    // Edit Note
    const editNote = async () => {
        const noteId = noteData._id
        try {
            const response = await axiosinstance.put('/notes/edit-note/' + noteId, {
                title,
                content,
                tags
            })

            if (response.data && response.data.note) {
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message)
            }
        }
    }

    const handleAddNote = () => {
        if (!title) {
            setError('Please enter the title')
            return
        }

        if (!content) {
            setError("Please enter the content")
            return;
        }

        setError('')

        if (type === 'edit') {
            editNote()
        } else {
            addNewNote()
        }
    }
    return (
        <div className='relative'>
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
                <MdClose className='text-xl text-slate-400' />
            </button>

            <div className="flex flex-col gap-2">
                <label className='input-label'>TITLE</label>
                <input
                    type="text"
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Go To Gym At 5'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">CONTENT</label>
                <textarea
                    type='text'
                    className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                    placeholder='Content'
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className="mt-3">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

            <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>
        </div>
    )
}

export default AddEditNotes
