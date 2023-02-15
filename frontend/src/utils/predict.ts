import axios from 'axios';

type props = {
    blob : Blob
}

export namespace predict {
    //axios.defaults.url = "http://localhost:8080/"
    export const predict_user = async (props : props) => {
        console.log(props.blob)
        const file = new FormData()
        file.append("file", new File([props.blob], "image.png"));
        const user = await axios.post('http://localhost:8080/inference/predict/', file, {
            headers: {
                'Content-Type': `multipart/form-data`,
             }
        }).then(res => {
            if(res.data.status_code == 200){
                return res.data.data
            }
            else{
                return res.data.description
            }
        })

        return user
    }
}