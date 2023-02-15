# Present Backend

In order to run the frontend, make sure you have python3 and pip installed on your system,

```
pip install pipenv
```

Then add pipenv path in your .bashrc

```
pipenv shell
pipenv install
```
Add .env variables
```
DATABASE_URL= [your mongodb url here]
secret_key= [some secret key]
```

For Amazon S3, See beanie docs about how to add AWS keys on your machine config. Run the Jupyter Notebook File with the data and save the weights. Weights were too big for github.

Then to run the project
```
python main.py
```
