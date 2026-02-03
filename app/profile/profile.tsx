import { Admin } from "@/app/types";
import { use } from "react";

type Props = {
    admin: Admin;
}

export default function AdminProfilePage({}: Props) {
    const [ isEdit, useIsEdit ] = React.useState(false);
    const [ profile, setProfile ] = useState({
        name= admin.name
        phone= admin.phone
        
    })
    return (
        <div className="w-full bg-gray-100 p-6">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6"
                    
    )