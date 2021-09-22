import { LocalNotification } from "../notificationsManager/notificationManager"

export const NotificPopUp = (props, serverNotifications, allProperties, matchingInfos)=>{
    //serverNotifications is the messages and notifications
    //allProperties all properties posted on the system
    //matchingInfos user defined specifications

    if (Object.keys(matchingInfos).length > 0){
        const notifyProp = certainSpecifications(allProperties, matchingInfos)

		if (Object.keys(notifyProp).length > 0)
			LocalNotification(props, "Temporary", "Specifications", `We saw your specifications and we recommend you this`, 0, {notifyProp})
    }
    else{
        for (var sn in serverNotifications){
            const type = serverNotifications[sn].type.toLowerCase()
            const info = serverNotifications[sn].info

            if (Object.keys(info).length > 0){
                for (var i in info){
                    switch(type){
                        case "messages":
                            const navDestination = serverNotifications[sn].type.charAt(0).toUpperCase()+type.slice(1)
                            LocalNotification(props, navDestination, type, info[i].message_text, 
                                info[i].message_id, {})
                        break;
                        case "notifications":
                            LocalNotification(props, navDestination, type, info[i].notification_type, 
                                info[i].message_id, {})
                        break;
                        default:
                            console.log("not Type...")
                    }
                }
            }
        }
    }
}

const certainSpecifications = (allProperties, matchingInfos)=>{
    const rand = Math.floor(Math.random()*Object.keys(matchingInfos).length)

    const jewelPatt = /ry|jew|wel|ace|let|.*k/gmi
	const vehicPatt = /(hon|nda|cle|vehi|eel|yot|cr|or)/gmi
	const realPatt = /oor|sq|ter|uar|.*seand|.*sandl|hal|lot|estate|real|ous/gmi

    const speckeys = []
	const keys_to_server = []
	const spec = matchingInfos[2] // change to rand
	const newkey = spec.newkey.split(" ")

	newkey.map((strkey)=>{
		if (jewelPatt.test(strkey)){
			const match = strkey.match(jewelPatt)[0]
			speckeys.push({newkey: match, proptype: 'jewelry'})
		}
		if (vehicPatt.test(strkey)){
			const match = strkey.match(vehicPatt)[0]
			speckeys.push({newkey: match, proptype: 'vehicle'})
		}
		if(realPatt.test(strkey)){
			const match = strkey.match(realPatt)[0]
			speckeys.push({newkey: match, proptype: 'realestates'})
		}
	})

	speckeys.map((ksVal)=>{
		const proptype = ksVal.proptype
		if (proptype === "jewelry"){
			allProperties.map((pVal)=>{
				if (pVal.type === proptype){
					const jewelry_name = pVal.info[0].jewelry_name
					const jewelry_desc = pVal.info[0].jewelry_description

					const newJewelPatt = RegExp(ksVal.newkey, 'gi')

					const match_jname = jewelry_name.match(newJewelPatt)
					const match_jdesc = jewelry_desc.match(newJewelPatt)

					if (match_jname !== null){
						if (Object.keys(keys_to_server).length > 0)
							keys_to_server.filter((val)=> val.itemID === pVal.itemID)
						else
							keys_to_server.push(pVal)
					}
					if (match_jdesc !== null){
						if (Object.keys(keys_to_server).length > 0)
							keys_to_server.filter((val)=> val.itemID === pVal.itemID)
						else
							keys_to_server.push(pVal)
					}
				}
			})
		}//end of jewelry
		else if (proptype === "vehicle"){
			allProperties.map((pVal)=>{
				if (pVal.type === proptype){
					const vehicle_name = pVal.info[0].vehicle_name
					const vehicle_model = pVal.info[0].vehicle_model
					const vehicle_description = pVal.info[0].vehicle_description

					const newVehicPatt = RegExp(ksVal.newkey, 'gi')

					const match_vname = vehicle_name.match(newVehicPatt)
					const match_vmodel = vehicle_model.match(newVehicPatt)
					const match_vdesc = vehicle_description.match(newVehicPatt)

					if (match_vname !== null){
						if (Object.keys(keys_to_server).length > 0)
							keys_to_server.filter((val)=> val.itemID === pVal.itemID)
						else
							keys_to_server.push(pVal)
					}
					if (match_vmodel !== null){
						if (Object.keys(keys_to_server).length > 0)
							keys_to_server.filter((val)=> val.itemID === pVal.itemID)
						else
							keys_to_server.push(pVal)
					}
					if (match_vdesc !== null){
						if (Object.keys(keys_to_server).length > 0)
							keys_to_server.filter((val)=> val.itemID === pVal.itemID)
						else
							keys_to_server.push(pVal)
					}
				}
			})
		}//end of vehicle
		else if (proptype === "realestates"){
			allProperties.map((pVal)=>{
				if (pVal.type === proptype){
					const realestate_type = pVal.info[0].realestate_type
					const type = pVal.info[0].type
					const developer = pVal.info[0].developer
					const realestate_desc = pVal.info[0].realestate_description

					const newRealPatt = RegExp(ksVal.newkey, 'gmi')
					
					const match_rreal_type = realestate_type.match(newRealPatt)
					const match_rtype = type.match(newRealPatt)
					const match_rdev = developer.match(newRealPatt)
					const match_rdesc = realestate_desc.match(newRealPatt)
					
					if (match_rreal_type !== null){
						if (Object.keys(keys_to_server).length > 0)
							keys_to_server.filter((val)=> val.itemID === pVal.itemID)
						else
							keys_to_server.push(pVal)
					}
					if (match_rtype !== null){
						if (Object.keys(keys_to_server).length > 0)
							keys_to_server.filter((val)=> val.itemID === pVal.itemID)
						else
							keys_to_server.push(pVal)
					}
					if (match_rdev !== null){
						if (Object.keys(keys_to_server).length > 0)
							keys_to_server.filter((val)=> val.itemID === pVal.itemID)
						else
							keys_to_server.push(pVal)
					}
					if (match_rdesc !== null){
						if (Object.keys(keys_to_server).length > 0)
							keys_to_server.filter((val)=> val.itemID === pVal.itemID)
						else
							keys_to_server.push(pVal)
					}
				}
			})
		}//end of realestate
	})

    return keys_to_server
}