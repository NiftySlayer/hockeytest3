
function GameSelectComp() {

    const [gameObj, setGameObj] = React.useState(null);




    const [userInput, setUserInput] = React.useState('');

    function handleChange(event) {
        // Get the input from the user and save it in a state variable
        // event.target is the input element
        setUserInput(event.target.value);
    }

    function handleSubmit(event) {
        changeHandler(userInput);   // notify my parent of the change in city
    }

 
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Choose your game:
                    <select value={userInput} onChange={handleChange}>
                        <option>Please select a game</option>
                        {games.map((game) =>
                            <option key={game.index} value={game}>
                                {game}</option>
                        )}
                    </select>
                </label>
             
            </form>

        </div>
    );
}
