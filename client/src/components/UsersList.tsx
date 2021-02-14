import React from 'react';

interface UsersListProps {
  sessionName: string,
  users: string[]
}

export const UsersList: React.FC<UsersListProps> = ({sessionName, users}: UsersListProps) => {
  return (
    <div className="userslist">
      <h4 className="userslist_heading">{sessionName}</h4>
      <ul className="userslist_list">
        {users.map((user, index) => <li key={index} className="userslist_list_item">{index + 1} - {user}</li>)}
      </ul>
    </div>
  )
}