import boto3
import io

def upload_bytes(file, filename):
    client = boto3.client('s3')
    client.put_object(Body=file, Bucket="vip-project", Key=filename)

async def download_bytes(filename):
    client = boto3.client('s3')
    byte_io = io.BytesIO()
    client.download_fileobj(Bucket="vip-project", Key=filename, Fileobj=byte_io)
    return byte_io