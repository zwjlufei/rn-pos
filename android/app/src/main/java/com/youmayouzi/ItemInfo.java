package com.youmayouzi;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * 菜品信息
 * 
 * @author TIANHUI
 * 
 */
public class ItemInfo {

	public String name;// 
	public String count;//
	public String price;// 

	public ItemInfo() {

	}

	public static final Parcelable.Creator<ItemInfo> CREATOR = new Parcelable.Creator<ItemInfo>() {
		public ItemInfo createFromParcel(Parcel in) {
			return new ItemInfo(in);
		}

		public ItemInfo[] newArray(int size) {
			return new ItemInfo[size];
		}
	};


	private ItemInfo(Parcel in) {
		name = in.readString();
		count = in.readString();
		price = in.readString();
	}

}
