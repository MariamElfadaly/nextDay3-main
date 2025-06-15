'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function HomePage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (!res.ok) {
        const errMsg = await res.text()
        throw new Error('Failed to fetch users: ' + errMsg)
      }
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('fetchUsers error:', error)
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Add failed:', errorText)
      }

      setName('')
      setEmail('')
      fetchUsers()
    } catch (err) {
      console.error('handleAdd error:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Delete failed:', errorText)
      }

      fetchUsers()
    } catch (err) {
      console.error('handleDelete error:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="container py-4">
      <h1 className="mb-4">User Management</h1>

      {session ? (
        <div className="mb-4">
          <p>Welcome, {session.user.name}</p>
          <img
            src={session.user.image}
            alt="User"
            className="rounded-circle me-2"
            width={40}
            height={40}
          />
          <button className="btn btn-outline-danger" onClick={() => signOut()}>
            Logout
          </button>
        </div>
      ) : (
        <button className="btn btn-primary mb-4" onClick={() => signIn('google')}>
          Login with Google
        </button>
      )}

      {session && (
        <>
          <div className="mb-3 row g-2 align-items-center">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
            <div className="col-md-4">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="col-md-4">
              <button className="btn btn-success w-100" onClick={handleAdd}>
                Add User
              </button>
            </div>
          </div>

          <ul className="list-group">
            {users.map((user) => (
              <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{user.name}</strong> - {user.email}
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
