import {User} from '../types/user';
import axios from 'axios';

type props = {
    user : User,
    blob : Blob
}

export namespace register {
    //axios.defaults.url = "http://localhost:8080/"
    
    export const register_user = async (props : props) => {
        const file = new FormData()
        file.append("image", new File([props.blob], "image.png"));
        file.append("name", props.user.name)
        if(props.user.password){
            file.append("password", props.user.password)
        }
        if(props.user.user_type){
            file.append("user_type", props.user.user_type)
            console.log(props.user.user_type, props.user.name, props.user.email, props.user.password)
        }
        file.append("email", props.user.email)
        
        await axios.post('http://localhost:8080/inference/register/', file, {
            headers: {
                'Content-Type': `multipart/form-data`,
             }
        }).then(res => {
            return res.data
        })
    }
}