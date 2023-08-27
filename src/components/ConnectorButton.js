
import {
    useConnector,
} from "@fun-xyz/react";

const ConnectorButton = ({ index }) => {
    const { active, activate, deactivate, connectorName, connector } = useConnector({ index });

    const handleActivate = () => {
        if (active) {
            deactivate(connector)
            return
        }
        activate(connector)
    }
    return (
        <>
            <button onClick={handleActivate}>{active ? ("Disconnect") : ("Connect")} {connectorName}</button>
        </>
    )
}

export default ConnectorButton