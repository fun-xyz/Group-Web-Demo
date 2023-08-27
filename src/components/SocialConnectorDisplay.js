import {
    useConnector,
    SocialLoginConnector,
} from "@fun-xyz/react";

const SocialConnectorDisplay = ({ index }) => {
    const { activate, deactivate, active, account, connectorName, connector } = useConnector({
        index
    });

    return (
        <div className="App"
            style={{ margin: "6px", padding: "6px", border: "1px solid black" }}
        >
            Current Connector Name: {connectorName}
            <br></br>
            Status: {active ? "Connected" : "Not Connected"}
            <br></br>
            {active && <>Address: {account}</>}
            <br></br>
            <br></br>
            {
                active ?
                    <button
                        onClick={
                            () => {
                                if (active) {
                                    deactivate(connector)
                                    return
                                }
                            }
                        }>Disconnect {connectorName}</button> :
                    <></>
            }

            <br></br>
            <br></br>
            {connector instanceof SocialLoginConnector && connector.supportedAuthProviders.map((provider) => {
                return (
                    <button
                        onClick={() => {
                            activate(connector, provider);
                        }}
                    >
                        {" "}
                        Connect {provider}
                    </button>
                )
            })}
        </div>
    )
}

export default SocialConnectorDisplay