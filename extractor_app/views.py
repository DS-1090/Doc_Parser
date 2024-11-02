from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
import easyocr
import re

@csrf_exempt
# @api_view(['POST'])
def upload_file(request):
    if(request.method == 'POST'):
        file = request.FILES.get('file')

        if not file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        image = Image.open(file)
        reader = easyocr.Reader(['en']) 
        readText = reader.readtext(image, detail=0)
        #print(readText)
        
        if(readText==""):
            return JsonResponse({'error': 'Failed to process image'}, status=400)

        extractedData = extract_information(" ".join(readText))
        return JsonResponse(extractedData)

def extract_information(text):
    print(text)
    name_object = re.search(r'Name\s+(.+?)\s+DOB', text)  
    exp_object = re.search(r'Validity\s+(\d{2}/\d{2}/\d{4})', text)  
    doctype_object = re.search(r'Licence to Drive Vehicles', text) 
    docnumber_object = re.search(r"Licence No (\w+-\d{13})",text)
    name = name_object.group(1).strip() if name_object else None
    
    return {
        'Name': name,
        'Document Type': 'Driver License' if doctype_object else None,
        'Expiration Date': exp_object.group(1) if exp_object else None,
        'Document Number': docnumber_object.group(1) if docnumber_object else None,
    }
