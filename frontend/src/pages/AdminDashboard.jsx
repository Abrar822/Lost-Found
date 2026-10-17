import { BuildingOfficeIcon, PencilSimpleIcon, TagIcon, EnvelopeIcon, UsersIcon, PhoneIcon, TrashIcon } from "@phosphor-icons/react";
import { deleteUser, updateOrganization } from "../api/AdminApi";
import { useState, useEffect } from "react";

export default function AdminDashboard({ organization, setOrganization, users, setUsers, setAlert, loading, setLoading }) {
    const [isEdit, setIsEdit] = useState(false)
    const [editData, setEditData] = useState({
        name: "",
        code: "",
        email: ""
    })

    useEffect(() => {
        setEditData({
            name: organization.name,
            code: organization.code,
            email: organization.email
        })
    }, [organization, isEdit])

    function handleEditChange(event) {
        setEditData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    async function handleDelete(u_id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );
        if (!confirmed) return;
        try {
            await deleteUser(u_id)
            setUsers((prevUsers) => prevUsers.filter((user) => user.u_id !== u_id))
            setOrganization((prev) => ({
                ...prev,
                users: Math.max(0, Number(prev.users) - 1)
            }))
            setAlert({ msg: "User deleted sucessfully", state: true })
        }
        catch (error) {
            console.error("Error deleting user:", error);
            setAlert({ msg: 'Failed to delete user', state: true })
        }

    }

    async function handleEdit(event) {
        try {
            event.preventDefault()
            setLoading(true)
            const data = await updateOrganization(editData)
            setOrganization((prev) => ({
                ...prev,
                name: data.Name,
                code: data.Code,
                email: data.Email
            }))
            setAlert({ msg: "Organization data updated sucessfully", state: true })
            setIsEdit(false)
            setLoading(false)
        }
        catch (error) {
            setLoading(false)
            console.error("Error updating organization:", error);
            setAlert({ msg: 'Failed to update organization info', state: true })
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* {isEdit &&
                <div
                    className="overlay absolute inset-0 bg-black/60 z-1"
                    onClick={() => {
                        setIsEdit(false);
                    }}
                ></div>
            } */}
            <div className="absolute top-17.5 left-40 right-40 flex flex-col gap-10">
                <div className="mt-6">
                    <div className="font-bold text-4xl">
                        Organization Dashboard
                    </div>
                    <div className="ml-0.5 text-slate-700">
                        Manage your organization and its registered members.
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm flex gap-6">
                    <div>
                        <BuildingOfficeIcon size={80} className="rounded-full text-(--orange) bg-orange-100 p-2" />
                    </div>
                    <div className="flex flex-col w-full mr-6 gap-4">
                        <div className="flex justify-between items-center">
                            <div className="font-bold text-2xl">
                                {organization.name}
                            </div>
                            <button className="flex items-center gap-2 rounded-lg bg-(--green) text-white py-2 px-3 transition-all duration-200 ease-in-out
                        hover:brightness-90 hover:shadow-md
                        active:scale-[0.98]
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--green)
                        cursor-pointer" onClick={() => setIsEdit(true)}>
                                <PencilSimpleIcon size={20} />
                                Edit Organization
                            </button>
                        </div>
                        <div className="flex">
                            <div className="flex items-center gap-4 pr-6">
                                <TagIcon size={40} className="rounded-lg text-(--orange) bg-orange-100 p-2" />
                                <div>
                                    <div className="text-sm text-slate-700">
                                        Organization Code
                                    </div>
                                    <div className="font-semibold">
                                        {organization.code}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 border-l border-gray-300 px-6">
                                <EnvelopeIcon size={40} className="rounded-lg text-(--orange) bg-orange-100 p-2" />
                                <div>
                                    <div className="text-sm text-slate-700">
                                        Email Address
                                    </div>
                                    <div className="font-semibold">
                                        {organization.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 border-l border-gray-300 px-6">
                                <UsersIcon size={40} className="rounded-lg text-(--orange) bg-orange-100 p-2" />
                                <div>
                                    <div className="text-sm text-slate-700">
                                        Total Members
                                    </div>
                                    <div className="font-semibold">
                                        {organization.users}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col rounded-lg bg-white p-4 shadow-sm gap-4">
                    <div>
                        <div className="font-bold text-2xl">
                            Registered Users
                        </div>
                        <div className="text-slate-700">
                            Users linked to your organization.
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {users.map((user) => (
                            <div key={user.u_id} className="flex min-w-0 items-center gap-4 border rounded-lg border-gray-300 p-4">
                                <div className="flex items-center justify-center shrink-0 h-12 w-12 rounded-full text-xl font-semibold text-(--dark-green) bg-green-100">
                                    {user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                                </div>
                                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                    <div className="truncate font-bold">
                                        {user.name}
                                    </div>
                                    <div className="flex min-w-0 items-center gap-2 text-sm">
                                        <EnvelopeIcon size={18} />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <PhoneIcon size={18} />
                                        {user.phone}
                                    </div>
                                </div>
                                <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-red-500 text-red-500 transition hover:bg-red-50 cursor-pointer" onClick={() => handleDelete(user.u_id)}>
                                    <TrashIcon size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isEdit &&
                <div className="fixed inset-0 z-2 flex items-center justify-center bg-black/60" onClick={() => setIsEdit(false)}>
                    <form className="flex flex-col gap-3 w-100 rounded-xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()} onSubmit={handleEdit}>
                        <div className="flex items-center border rounded-lg px-2 py-1 gap-2">
                            <BuildingOfficeIcon size={30} className="text-(--orange)" />
                            <input type="text"
                                placeholder="Organization Name"
                                id="name"
                                name="name"
                                value={editData.name}
                                onChange={handleEditChange}
                                className="flex-1 min-w-0 px-2 focus:outline-none focus:ring-0"
                            />
                        </div>
                        <div className="flex items-center border rounded-lg px-2 py-1 gap-2">
                            <TagIcon size={30} className="text-(--orange)" />
                            <input type="text"
                                placeholder="Organization Code"
                                id="code"
                                name="code"
                                value={editData.code}
                                onChange={handleEditChange}
                                className="flex-1 min-w-0 px-2 focus:outline-none focus:ring-0"
                            />
                        </div>
                        <div className="flex items-center border rounded-lg px-2 py-1 gap-2">
                            <EnvelopeIcon size={30} className="text-(--orange)" />
                            <input type="text"
                                placeholder="Email"
                                id="email"
                                name="email"
                                value={editData.email}
                                onChange={handleEditChange}
                                className="flex-1 min-w-0 px-2 focus:outline-none focus:ring-0"
                            />
                        </div>
                        <button type="submit" className="self-center inline-flex items-center justify-center gap-2 rounded-lg bg-(--green) px-6 py-2 text-white hover:brightness-120 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80">
                            {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}<span>{loading ? "Updating..." : "Submit"}</span>
                        </button>
                    </form>
                </div>
            }
        </>
    )
}