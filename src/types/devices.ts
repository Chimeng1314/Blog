export type DeviceStatus = "在用" | "弃用" | "已售" | "在售" | "个人出售";

export type Device = {
	slug: string;
	name: string;
	/** public/assets/images/devices 下的本站本地图片。 */
	image?: string;
	icon?: string;
	specs?: string;
	description?: string;
	/** 设备官网、购买页或说明书链接。 */
	url: string;
	/** false 时不显示设备外链。 */
	linkable?: boolean;
	/** 此设备关联的主设备，用于外设等从属设备。 */
	associatedDevice?: DeviceAssociation;
	purchasedAt?: string;
	status: DeviceStatus;
	specGroups: DeviceSpecGroup[];
	accessories: DeviceAccessory[];
};

export type DeviceCategory = {
	name: string;
	icon: string;
	devices: Device[];
};

export type DeviceAssociation = {
	slug: string;
	name: string;
};

export type DeviceSpecItem = {
	label: string;
	value: string;
	/** 规格对应的本地图，放在 public/assets/images/devices 下。 */
	image?: string;
	url?: string;
	/** false 时显示纯文本；未设置时仅在 url 存在时显示跳转链接。 */
	linkable?: boolean;
};

export type DeviceSpecGroup = {
	title: string;
	items: DeviceSpecItem[];
};

export type DeviceAccessory = {
	name: string;
	model: string;
	description?: string;
	image?: string;
	/** 无产品图时显示的 Iconify 图标。 */
	icon?: string;
	/** 此外设所关联的设备名称。 */
	associatedDevice?: string;
	url?: string;
	linkable?: boolean;
};
