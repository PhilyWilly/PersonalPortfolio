if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=9600, reload=True) # Production (i hope this will work fine)